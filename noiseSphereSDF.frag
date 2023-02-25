uniform float uTime;
uniform vec2 uResolution;
#include "util"

out vec4 fragColor;
float sphereSDF(vec3 p){
    return length(p) - 1.0;
}
float sceneSDF(vec3 p){
    return sphereSDF(p) * 0.01 * pnoise31(10.0 * p);
}
vec3 gradSDF(vec3 p){
    float d = 0.001;
    return normalize(vec3(
        sceneSDF(p + vec3(d, 0.0, 0.0)) - sceneSDF(p - vec3(d, 0.0, 0.0)),
        sceneSDF(p + vec3(0.0, d, 0.0)) - sceneSDF(p - vec3(0.0, d, 0.0)),
        sceneSDF(p + vec3(0.0, 0.0, d)) - sceneSDF(p - vec3(0.0, 0.0, d))
    ));
}
void main()
{
	vec2 p = (gl_FragCoord.xy * 2 - uResolution.xy) / min(uResolution.x, uResolution.y);
	float t = uTime * 0.3;
	vec3 cPos = rotY(vec3(0,0,2.0), t);
	vec3 cDir = rotY(vec3(0.0, 0, -1),t);
	vec3 cUp = rotY(vec3(0.0, 1.0, 0.0), t);
	vec3 cSide = cross(cDir, cUp);
	float targetDepth = 1.0;
	
	vec3 ray = p.x * cSide + p.y * cUp + targetDepth * cDir;
	vec3 rPos = ray + cPos;
	ray = normalize(ray);

	vec3 lDir = rotY(vec3(1.0), t);
	
	bool hit = false;

	fragColor = TDOutputSwizzle(vec4(vec3(0.0),1.0));
	for (int i = 0; i < 50; i++) {
		if (sceneSDF(rPos) > 0.001) {
			rPos += sceneSDF(rPos) * ray;
		} else {
			float amb = 0.1;
			float diffuse = max(dot(lDir,gradSDF(rPos)),0);
			float text = pnoise31(10.0 * rPos);
			vec3 yellow = vec3(pnoise31(10 * rPos),pnoise31(5 * rPos),pnoise31(rPos));
			fragColor = TDOutputSwizzle(vec4(vec3((diffuse + amb) * text * yellow), 1));
			break;
		}
	}
}
