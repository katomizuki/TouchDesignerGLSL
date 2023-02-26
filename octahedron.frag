uniform float uTime;
uniform vec2 uResolution;

#include "util"

out vec4 fragColor;

float smin(float d1, float d2, float r) {
	float c = clamp(0.5 + (d2 - d1) * (0.5 / r), 0.0, 1.0);
	return mix(d2, d1, c) - r * c * (1.0 - c);
}

float sphereSDF(vec3 p, vec3 c, float r) {
	return length(p - c) - r;
}

// 平面ＳＤＦ
float planeSDF(vec3 p, vec3 n, float s) {
	// position , normal, 原点と平面の距離 
	return dot(normalize(n), p) - s;
}

// 正八面体ＳＤＦ
float octaSDF(vec3 p, float s) {
	// pをおりたたんで平面ＳＤＦにいれる
	return planeSDF(abs(p), vec3(1.0), s);
}

float sceneSDF(vec3 p) {
	float t = 0.3 + 0.2 * sin(uTime);
	// 正八面体
	float d1 = octaSDF(p, 0.5);
	// 球
	float d2 = sphereSDF(abs(p), vec3(t), 0.1);
	// 補間
	return smin(d1, d2, 0.1);
}

vec3 gradSDF(vec3 p) {
	float d = 0.001;
	return normalize(
		vec3(
			sceneSDF(p + vec3(d, 0, 0)) - sceneSDF(p - vec3(d, 0, 0)),
			sceneSDF(p + vec3(0, d, 0)) - sceneSDF(p - vec3(0, d, 0)),
			sceneSDF(p + vec3(0, 0, d)) - sceneSDF(p - vec3(0, 0, d))
		)
	);
}

void main()
{
	vec2 p = (gl_FragCoord.xy * 2 - uResolution.xy) / min(uResolution.x, uResolution.y);
	vec3 t = vec3(uTime * 0.3);
	vec3 cPos = euler(vec3(0.0, 0.0, 2.0), t);
	vec3 cDir = euler(vec3(0.0, 0.0, -1.0), t);
	vec3 cUp = euler(vec3(0.0, 1.0, 0.0), t);
	vec3 cSide = cross(cDir, cUp);
	
	float targetDepth = 1.0;
	
	vec3 ray = cSide * p.x + cUp * p.y + targetDepth * cDir;
	vec3 rPos = ray + cPos;
	ray = normalize(ray);

	vec3 lDir = normalize(vec3(1.0));

	fragColor = TDOutputSwizzle(vec4(vec3(0), 1));

	for (int i = 0; i < 50; i++) {
		if (sceneSDF(rPos) > 0.001) {
			rPos += ray * sceneSDF(rPos);
		} else {
			float amb = 0.1;
			float diffuse = max(dot(lDir, gradSDF(rPos)), 0);
			vec3 color = vec3(1,1,0);
			vec4 finalColor = vec4(color * (diffuse + amb), 1);
			fragColor = TDOutputSwizzle(finalColor);
		}
	}
}
