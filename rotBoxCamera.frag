uniform vec2 uResolution;
uniform float uTime;
#include "util"

out vec4 fragColor;

float boxSDF(vec3 p, vec3 c, vec3 d, float t){
    p = abs(p - c);
    return length(max(p - d, vec3(0.0))) + min(max(max(p.x - d.x, p.y - d.y), p.z - d.z), 0.0) - t;
}

float sceneSDF(vec3 p) {
	vec3 center = vec3(0.0, 0.0, 0.0);
	vec3 scale = vec3(0.5);
	float thickness = 0.1;
	return boxSDF(p, center, scale, thickness);
}

vec3 gradSDF(vec3 p) {
	float d = 0.001;
	return normalize(vec3(
		sceneSDF(p + vec3(d, 0, 0)) - sceneSDF(p - vec3(d, 0, 0)),
		sceneSDF(p + vec3(0, d, 0)) - sceneSDF(p - vec3(0, d, 0)),
		sceneSDF(p + vec3(0, 0, d)) - sceneSDF(p - vec3(0, 0, d))
	));
}

void main()
{
	vec2 p = (gl_FragCoord.xy * 2.0 - uResolution.xy) / min(uResolution.x, uResolution.y);
	vec3 t = vec3(uTime * 0.5);
	vec3 cPos = euler(vec3(0.0, 0.0, 2.0), t);
	vec3 cDir = euler(vec3(0.0, 0.0, -1.0), t);
	vec3 cUp = euler(vec3(0.0, 1.0, 0.0), t);
	vec3 cSide = cross(cDir, cUp);

	float targetDepth = 1.0;

	vec3 ray = cUp * p.y + cSide * p.x + cDir * targetDepth;
	vec3 rPos = ray + cPos;
	normalize(ray);

	vec3 lDir = euler(vec3(0.0,0.0, 1.0), t);

	fragColor = TDOutputSwizzle(vec4(vec3(0.0),1));

	for (int i = 0; i < 50; i++) {
		if (sceneSDF(rPos) > 0.001) {
			rPos += sceneSDF(rPos) * ray;
		} else {
			float amb = 0.1;
			float diffuse = max(dot(lDir, gradSDF(rPos)), 0);
			vec3 col = vec3(0.0, 1.0, 0.0);
			fragColor = vec4(vec3(col * (diffuse + amb)),1);
			break;
		}
	}
}
