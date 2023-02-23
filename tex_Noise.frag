uniform float uTime;
uniform vec2 uResolution;
uniform vec2 uMouse;
#include "util"

out vec4 fragColor;

float text(vec2 st) {
	float time = 0.3 * uTime;
	float v0 = warp21(st + time, 1.0);
	float v1 = fdist31(vec3(st + time, time));
	time = abs(mod(time, 2.0) - 1.0);
	return mix(v0, v1, smoothstep(0.25, 0.75, time));
}
void main()
{
	vec2 p = (gl_FragCoord.xy * 2.0 - uResolution.xy) / min(uResolution.x,uResolution.y);
	vec3 cPos = vec3(0.0, 0.0, 0.0);
	float t = -0.25 * PI;
	vec3 cDir = rotX(vec3(0.0, 0.0,-1.0), t);
	vec3 cUp = rotX(vec3(0.0, 1.0, 0.0), t);
	vec3 cSide = cross(cDir, cUp);
	float targetDepth = 1.0;
	vec3 ray = cSide * p.x + cUp * p.y + cDir * targetDepth - cPos;
	ray = normalize(ray);
	vec3 groundNormal = vec3(0.0, 1.0, 0.0);
	float groundHeight = 1;
	vec3 lPos = vec3(0.0,0.0,0.0);
	if(dot(ray, groundNormal) < 0.0) {
		vec3 hit = cPos - ray * groundHeight / dot(ray, groundNormal);
		float diff = max(dot(normalize(lPos - hit), groundNormal), 0.0);
		diff *= 1.2;
		diff = pow(diff, 0.8);
		fragColor =TDOutputSwizzle(vec4(vec3(diff * text(hit.xz)),1));
	} else {
		fragColor = TDOutputSwizzle(vec4(vec3(1.0,0.0,0),1));
	}
}
