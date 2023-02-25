#include "util"
uniform float uTime;
uniform vec2 uResolution;

out vec4 fragColor;
float sphereSDF(vec3 p, vec3 c, float s) {
	return sqrt(dot(p - c, p - c)) - s;
}

float sceneSDF(vec3 p) {
	vec3 center = vec3(0.0);
	float scale = 0.1;
	// 空間を－0.5～0.5に変換する
	return sphereSDF(fract(p + 0.5) - 0.5, center, scale);
}

vec3 gradSDF(vec3 p) {
	float d = 0.001;
	return normalize(
		vec3(
			sceneSDF(p + vec3(d, 0.0, 0.0)) - sceneSDF(p - vec3(d, 0.0, 0.0)),
			sceneSDF(p + vec3(0.0, d, 0.0)) - sceneSDF(p - vec3(0.0, d, 0.0)),
			sceneSDF(p + vec3(0.0, 0.0, d)) - sceneSDF(p - vec3(0.0,0.0, d))	
		)
	);
}
void main()
{
	vec2 p = (gl_FragCoord.xy * 2 - uResolution.xy) / min(uResolution.x, uResolution.y);
	vec3 t = vec3(uTime * 0.1);
	vec3 cPos = euler(vec3(0.0, 0.0, .5), t);
	vec3 cDir = euler(vec3(0.0, 0.0, -1.0), t);
	vec3 cUp = euler(vec3(0.0, 1.0, 0.0),t);
	vec3 cSide = cross(cDir, cUp);
	float targetDepth = 1.0;

	vec3 ray = p.x * cSide + p.y * cUp + cDir * targetDepth;
	vec3 rPos = cPos;
	ray = normalize(ray);

	vec3 lDir = vec3(1.0);

	fragColor = TDOutputSwizzle(vec4(vec3(0.0),1));
	for (int i = 0; i < 50; i++) {
		if (sceneSDF(rPos) > 0.001) {
			rPos += ray * sceneSDF(rPos);
		} else {
			float amb = 0.4;
			float diffuse = 0.9 * max(dot(normalize(lDir), gradSDF(rPos)),0);
			vec3 color = vec3(1,1,0);
			vec4 finalColor = vec4(color * (diffuse * amb), 1);
			fragColor = TDOutputSwizzle(finalColor);
			break;
		}
	}
}
