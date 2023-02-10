
uniform vec2 uResolution;
uniform float uTime;

out vec4 fragColor;

// arctan2を得る
float atan2(float y, float x){
    if (x == 0.0){
        return sign(y) * 3.141592 / 2.0;
    } else {
        return atan(y, x);
    }
}

// 極座標ー＞直交
vec2 xy2pol(vec2 xy){
	// atan2 -pi/2 ~ pi/2 第一引数偏角　第二引数動径 
    return vec2(atan2(xy.y, xy.x), length(xy));
}

// 直交ー＞極座標
vec2 pol2xy(vec2 pol) {
	// 動径 * vec2(cos, sin)
    return pol.y * vec2(cos(pol.x), sin(pol.x));
}

// 極座標のテクスチャマッピング
vec3 tex(vec2 st) { // s => 偏角　t => 動径
	// 時間をつかった
    float time = 0.5 * uTime;
    vec3 circ = vec3(0.5 * pol2xy(vec2(time, 0.5)) + 0.5, 1.0);
    vec3[3] col3;
    col3[0] = circ.xyz;
    col3[1] = circ.yzx;
    col3[2] = circ.zxy;
    st.s = st.s / 3.141592 + 1.0;
    st.s += time;
    int ind = int(st.s);
	// 偏角で線形補完
    vec3 col = mix(col3[ind % 2], col3[(ind + 1) % 2], fract(st.s));
	// 動径で線形補完
    return mix(col3[2], col, st.t);
}
void main()
{
	vec2 position = (gl_FragCoord.xy * 2) / min(uResolution.x, uResolution.y); // フラグメント座標の正規化
	// 極座標に変換
	position = xy2pol(position);
	fragColor = TDOutputSwizzle(vec4(tex(position),1.0));
}
