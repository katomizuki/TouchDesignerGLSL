
uniform float uTime;
uniform vec2 uResolution;
uniform vec2 uMouse;
#include "util"
out vec4 fragColor;

float text(vec2 st) {
	return mod(floor(st.s) + floor(st.t), 2.0);
}

void main()
{
	// -1 ~ 1
	vec2 p = (gl_FragCoord.xy * 2 - uResolution.xy) / min(uResolution.x, uResolution.y);
	// camera Position
	vec3 cPos = vec3(0.0);
	// theta
	float t = -0.25 * PI;
	// カメラの前方方向を傾けたりしたいのでx軸を中心に回転させる
	vec3 cDir = rotX(vec3(0.0, 0.0, -1.0), t);
	// カメラの上方向をx軸中心に回転させる。
	vec3 cUp = rotX(vec3(0.0, 1.0, 0.0), t);
	// 法線を出す
	vec3 cSide = cross(cDir, cUp);
	// レイの深度の決定
	float targetDepth = 1.0;
	// レイベクトルを作成
	vec3 ray = cSide * p.x + cUp * p.y + targetDepth * cDir - cPos;
	// 正規化
	ray = normalize(ray);
	// 法線
	vec3 groundNormal = vec3(0.0, 1.0, 0.0);
	// 床の高さを０にする（－１～１）
	float groundHeight = 0.0;
	// 点光源の位置
	vec3 lPos = vec3(0.0);
	// もし当たったら
	if(dot(ray, groundNormal) < 0.0) {
		// 当たった場所を出す
		vec3 hit = cPos - ray * groundHeight / dot(ray, groundNormal);
		// 入射ベクトルを出す。法線との内積をだして0を切り捨てることで拡散反射光を再現 0 ~ 1
		float diff = max(dot(normalize(lPos - hit), groundNormal), 0.0);
		// マウスの場所yによって拡散反射の強さを変更させる
		diff *= 0.5 + uMouse.y / uResolution.y; // 0 ~ 1.5 を乗算 => diff = 0 ~ 1.5
		// マウスの場所ｘによって拡散反射の減衰を適用
		diff = pow(diff,  uMouse.x / uResolution.x); /// 0 ~ 1を累乗する diff => 0 ~ 1.5
		// 拡散反射をてきようさせつつテクスチャマッピング
		fragColor.rgb = vec3(diff * text(hit.zx));
	} else {
		fragColor.rgb = vec3(0.0);
	}
	fragColor.a = 1.0;
}
