out vec4 fragColor;
uniform float uTime;
uniform vec2 uResolution;
uniform vec2 uMouse;
const float PI = 3.141592;

vec2 rot2(vec2 p, float t) {
	return vec2(cos(t) * p.x - sin(t) * p.y, sin(t) * p.x + cos(t) * p.y);
}

vec3 rotX(vec3 p, float t) {
	return vec3(p.x, rot2(p.yz, t));
}

vec3 rotY(vec3 p, float t) {
	return vec3(p.y, rot2(p.zx, t)).zxy;
}

vec3 rotZ(vec3 p, float t) {
	return vec3(rot2(p.xy, t), p.z);
}
float text(vec2 st) {
	return mod(floor(st.s) + floor(st.t), 2.0);
}

void main()
{
	vec2 p = (gl_FragCoord.xy * 2 - uResolution.xy) / min(uResolution.x, uResolution.y);
	vec3 cPos = vec3(0,0,0);
	// マウスポインタ　Y座標を回転角に対応 どれくらいのｙ位置にいるかを割合でだして　それに	~0.5pi ~ 0にスケーリング
	float t = -0.5 * PI * (uMouse.y / uResolution.y);
	// カメラの向きをｘ軸に沿ってｔ分回転させる
	vec3 cDir = rotX(vec3(0,0,-1.0), t);
	// カメラの上向きをｘ軸に沿ってｔ分回転させる
	vec3 cUp = rotX(vec3(0,1,0), t);
	// カメラのスクリーンのサイド側のベクトル
	vec3 cSide = cross(cDir, cUp);
	// cameraから１奥にスクリーンを張る
	float targetDepth = 1.0;
	// rayを同じ方法で作成
	vec3 ray = cSide * p.x + cUp * p.y + cDir * targetDepth; - cPos;
	// 正規化
	ray = normalize(ray);
	// 地面の法線
	vec3 groundNormal = vec3(0,1,0);
	//　地面からカメラの高さ
	float groundHeight = 1.0 + (uMouse.x / uResolution.x);
	// 内積計算
	if (dot(ray, groundNormal) < 0.0) {
		//  カッコ内でカメラから交点までのレイを出してあげてる　cposに加算しているのはカメラ飛ばしているいるから
		vec3 hit = cPos + (- ray * groundHeight / dot(ray, groundNormal));
		fragColor.rgb = vec3(text(hit.zx));
	} else {
		fragColor.rgb = vec3(0.0);
	}
	fragColor.a = 1.0;
}
