
// Example Pixel Shader

// uniform float exampleUniform;
uniform vec2 uResolution;
out vec4 fragColor;

float sphereSDF(vec3 p) {
	return length(p) - 0.9;
}

float sceneSDF(vec3 p) {
	return sphereSDF(p);
}

vec3 gradSDF(vec3 p) {
	// 距離関数のｘ、ｙ、ｚそれぞれの偏微分をだして法線として扱う
	float d = 0.001;
	return normalize(vec3(
		sceneSDF(p + vec3(d, 0, 0)) - sceneSDF(p - vec3(d, 0, 0)),
		sceneSDF(p + vec3(0, d, 0)) - sceneSDF(p - vec3(0, d, 0)),
		sceneSDF(p + vec3(0, 0, d)) - sceneSDF(p - vec3(0, 0, d))
	));
}

void main()
{
	// -1 ~ 0
	vec2 p = (gl_FragCoord.xy * 2 - uResolution.xy) / min(uResolution.x, uResolution.y);
	// カメラポジション
	vec3 cPos = vec3(0.0, 0.0, 2.0);
	// カメラ方向 z方向にまっすぐ
	vec3 cDir = vec3(0.0, 0.0, -1.0);
	// カメラｙ方向
	vec3 cUp = vec3(0.0, 1.0, 0.0);
	// 外積で横を出す
	vec3 cSide = cross(cDir, cUp);
	// スクリーンの深度
	float targetDepth = 1.0;

// 点光源の場所
	vec3 lPos = vec3(2.0);
// rayベクトルの作成
	vec3 ray = cSide * p.x + cUp * p.y + cDir * targetDepth;
	// レイベクトルの先の位置　＝＞これをどんどん繰り返し処理で進めていく
	vec3 rPos = ray + cPos;
	// レイベクトルを正規化
	ray = normalize(ray);
	// 背景を黒色にする
	fragColor = TDOutputSwizzle(vec4(vec3(0.0),1));
// 50回繰り返し
	for(int i = 0; i < 50; i++) {
		// 交差しない場合　負の数だと衝突したことになる。
		if(sceneSDF(rPos) > 0.001) {
			// sdfの値だけrayを進める
			// sceneSDFからどれだけ進むかが帰ってくるのrayベクトルと乗算してrposに加算。
			rPos += sceneSDF(rPos) * ray;
		} else {
			// 環境光の強さ
			float amb = 0.1;
		// 点光源　ｰ　レイベクトルの先で入射ベクトルを算出＆勾配で法線を取得して拡散反射なので0以下を切り捨て	
			float diff = 0.9 * max(dot(normalize(lPos - rPos),gradSDF(rPos)), 0.0);
			vec3 col = vec3(0.0, 1.0, 1.0);
			fragColor = TDOutputSwizzle(vec4(vec3(col * (diff + amb)),1));
			break;
		}
	}
}
