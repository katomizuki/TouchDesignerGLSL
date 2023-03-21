
uniform vec2 uResolution;
uniform float uTime;
uniform float uCellCount;
uniform float rectangleSize;
uniform float speed;

out vec4 fragColor;

float rectangle(vec2 coord, vec2 offs) {
	// グリッドのセル数
	float reso = uCellCount;
	// 一つのセルの幅
	float cellWidth = (uResolution.x / reso);

    // 
	vec2 p = mod(coord, cellWidth) - cellWidth * 0.5 + offs * cellWidth;
	// セルのインデックスを取得
	vec2 p2 = floor(coord / cellWidth) + offs;

    vec2 gr = vec2(0.2, 0.1);
    float tr = uTime * speed; // 時間
	// 経過時間 + 内積（適当な値都の内積を設定しておくことでセルによって違う周期性を得る）
    float ts = tr + dot(p2, gr);

// 回転行列をかけて回す
    float sn = sin(tr), cs = cos(tr);
    p = mat2(cs, -sn, sn, cs) * p;

// 四角形の一片を計算。０．３～０．６をセルの幅にか３３る。 時間によって変わるようになる。
    float s = cellWidth * (rectangleSize + rectangleSize * sin(ts));
	// 座標Pから四角形の距離を計算する　０～１
    float d = max(abs(p.x), abs(p.y));
// 円の半径からｄを減算して絶対値をとる。0 ~ 0.7くらいになる。s＜dがマイナスだったら四角形の外　ｓ＞ｄ正だったら中になる
// => 1からそれをひくのはそれを実際の値を描画するのに使うから。 s - d が０につかづくほど境界線がに近づく

    return max(0.0, 1.0 - abs(s - d));
}

void main()
{
	float c = 0.0;
	for(int i = 0; i < 9; i++) {
		// ー１　０　１のどれか　i = 0, 3, 6: dx = mod(0, 3) - 1 = -1　i = 1, 4, 7: dx = mod(1, 3) - 1 = 0　i = 2, 5, 8: dx = mod(2, 3) - 1 = 1
		float dx = mod(float(i), 3.0) - 1.0;
		// -1 0 1 のどれかが入る。i = 0, 1, 2: dy = float(0) - 1 = -1= 3, 4, 5: dy = float(1) - 1 = 0　i = 6, 7, 8: dy = float(2) - 1 = 1
		float dy = float(i / 3) - 1.0;
		// 第一引数　フラグメント座標　第二引数　グリッド上のオフセット
		c += rectangle(gl_FragCoord.xy, vec2(dx,dy));
	}
	fragColor = TDOutputSwizzle(vec4(vec3(min(1.0,c)),1));
}
