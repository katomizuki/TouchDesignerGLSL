uniform vec2 uResolution;
uniform float uTime;
uniform vec2 uMouse;
#include "util"
out vec4 fragColor;

// c => 球の中心
float sphereSDF(vec3 p, vec3 c, float r) {
	return length(p - c) - r; 
}

// 球の中心を動かす
float sceneSDF(vec3 p) {
	// Y軸中心で回転させる。時間によって変化　xz平面での回転
	vec3 cent = rotY(vec3(0.0, 0.0, -0.5), uTime);
	float scale = 0.7;
	return sphereSDF(p, cent, scale);
}

// ｘ、ｙ、ｚ成分の偏微分をそれぞれ出して勾配を出す＝＞法線
// 法線は大きさ関係ないので基本正規化したほうが扱いやすい
vec3 gradSDF(vec3 p) {
	float eps = 0.001;
	return normalize(vec3(
		sceneSDF(p + vec3(eps, 0, 0)) - sceneSDF(p - vec3(eps, 0, 0)),
		sceneSDF(p + vec3(0, eps, 0)) - sceneSDF(p - vec3(0, eps, 0)),
		sceneSDF(p + vec3(0, 0 , eps)) - sceneSDF(p - vec3(0, 0, -eps))
		));
}

void main()
{
	// -1 ~ 1に変換
	vec2 p = (gl_FragCoord.xy * 2 - uResolution.xy) / min(uResolution.x, uResolution.y);
	// Camera Position
	vec3 cPos = vec3(0.0, 0.0, 2.0);
	// Camera Direction
	vec3 cDir = vec3(0.0, 0.0, -1.0);
	// Cameraの上方向
	vec3 cUp = vec3(0.0 , 1.0, 0.0);
	// カメラの横方向
	vec3 cSide = cross(cDir, cUp);

// 深度
	float targetDepth = 1.0;
	// レイ
	vec3 ray = cSide * p.x + cUp * p.y + cDir * targetDepth;
	// レイの先っぽのPosition
	vec3 rPos = ray + cPos;
	// レイを正規化
	ray = normalize(ray); 

// DirectionalLightのY軸によって回転させる
	vec3 lDir = rotY(vec3(0.0, 0.0, 1.0), uTime);

	fragColor = TDOutputSwizzle(vec4(vec3(0.0),1));

	for (int i = 0; i < 50; i++) {
		if (sceneSDF(rPos) > 0.001) {
			// 交差しない場合はSDFの分レイを進める　ここにきたら0.001 ~ 1=>sceneSDF
			rPos += sceneSDF(rPos) * ray;
		} else {
			float amb = 0.1;
			// DirectionalLightの入射光と法線をとって拡散反射なので０をきりすて
			float diff = 0.9 * max(dot(lDir,gradSDF(rPos)),0);
			vec3 col = vec3(0.0, 1.0, 1.0);
			fragColor = TDOutputSwizzle(vec4(vec3(col * (diff + amb)),1));
			break;
		}
	}
}
