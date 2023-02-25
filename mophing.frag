uniform vec2 uResolution;
uniform float uTime;
#include "util"

out vec4 fragColor;

// 球の距離関数
float sphereSDF(vec3 p, vec3 cent, float rad){
    return length(p - cent) - rad;
}
float sceneSDF(vec3 p){
	// 角度
    float t = 0.5 * uTime;
	// 回転させる
    p = euler(p, vec3(t));
    float d1 = 1.0;
	// 6回繰り返し
    for (float i = 0.0; i < 6.0; i++){
		// 円周上に球を配置する　＝＞　
        vec3 cent = vec3(cos(i), sin(i), 0.0);
		// 球関数を小さいものを更新していく
        d1 = min(d1, sphereSDF(p, cent, 0.2));
    }
    float d2 = sphereSDF(p, vec3(0.0), 1.); // 原点を中心とした球SDF
	// 余りが1未満の場合はd1になり1以上の場合はd2になる。
    return mix(d1, d2, abs(mod(t, 2.0) - 1)); // 二つの距離関数を補間 
}
vec3 gradSDF(vec3 p){
    float d = 0.0001;
    return normalize(vec3(
        sceneSDF(p + vec3(d, 0.0, 0.0)) - sceneSDF(p + vec3(-d, 0.0, 0.0)),
        sceneSDF(p + vec3(0.0, d, 0.0)) - sceneSDF(p + vec3(0.0, - d, 0.0)),
        sceneSDF(p + vec3(0.0, 0.0, d)) - sceneSDF(p + vec3(0.0, 0.0, - d))
    ));
}

void main()
{
	vec2 pos = (gl_FragCoord.xy * 2 - uResolution.xy) / min(uResolution.x, uResolution.y);
	vec3 cPos = vec3(0, 0, 2);
	vec3 cUp = vec3(0, 1,0);
	vec3 cDir = vec3(0, 0, -1);
	vec3 cSide = cross(cDir, cUp);

	float targetDepth = 1.0;
	
	vec3 ray = pos.x * cSide + pos.y * cUp + targetDepth * cDir;
	vec3 rPos = ray + cPos;
	ray = normalize(ray);

	vec3 lDir = normalize(vec3(0, 0, 1));

	fragColor = TDOutputSwizzle(vec4(vec3(0.0),1));
	for (int i = 0; i < 50; i++) {
		if (sceneSDF(rPos) > 0.001) {
			rPos += ray * sceneSDF(rPos);
		} else {
			float amb = 0.1;
			float diffuse = max(dot(lDir, gradSDF(rPos)), 0);
			vec3 color = vec3(1,1,0);
			vec4 finalColor = vec4(color * (diffuse + amb),1); 
			fragColor = TDOutputSwizzle(finalColor);
		}
	}

}
