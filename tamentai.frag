
// Example Pixel Shader

// uniform float exampleUniform;

out vec4 fragColor;
uniform float uTime;
uniform vec2 uResolution;
#include "util"

float sphereSDF(vec3 p, vec3 c, float r) {
	return length(p - c) - r;
}

float planeSDF(vec3 p, vec3 n, float s) {
	return dot(normalize(n), p) - s;
}

float octaSDF(vec3 p, float s) {
	return planeSDF(abs(p), vec3(1.0), s);
}

float boxSDF(vec3 p, vec3 c, vec3 d, float s) {
	p = abs(p - c);
	return length(max(p - d, vec3(0.0))) + min(max(max(p.x - d.x, p.y - d.y),p.z - d.z), 0.0) - s;
}

float sceneSDF(vec3 p) {
	vec3 v = vec3(0.5);
	float s = mix(1.0 / 3.0, 1.0, 0.5 * sin(uTime) + 0.5);
	float d1 = octaSDF(p, s * length(v));
	float d2 = boxSDF(p, vec3(0.0), v, 0.0);
	return max(d1, d2);
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

	vec3 ray = cSide * p.x + cUp * p.y + cDir * targetDepth;
	vec3 rPos = cPos + ray;
	ray = normalize(ray);

	vec3 lDir = normalize(euler(vec3(0, 0, 1), t));

	fragColor = TDOutputSwizzle(vec4(vec3(0.0), 1));

	for(int i = 0; i < 50; i++) {
		if(sceneSDF(rPos) > 0.001) {
			rPos += sceneSDF(rPos) * ray;
		} else {
			float amb = 0.1;
			float diff = 0.9 * max(dot(lDir, gradSDF(rPos)),0);
			vec3 col = vec3(0.0, 1.0, 1.0);
			fragColor = TDOutputSwizzle(vec4(vec3(col * (amb + diff)), 1));
		}
	}
}
