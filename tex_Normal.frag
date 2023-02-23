
// Example Pixel Shader

// uniform float exampleUniform;
uniform vec2 uResolution;
uniform float uTime;
#include "util"

out vec4 fragColor;
vec2 grad2(vec2 uv) {
	uv += 0.3 * uTime;
	float d = 0.001;
	/// 勾配の方程式
	return 0.5 * (vec2(
			warp21(uv + vec2(d, 0.0), 1.0) - warp21(uv - vec2(d,0.0), 1), 
			warp21(uv + vec2(0.0, d), 1.0) - warp21(uv - vec2(0.0, d), 1)
		)) / d;
}
void main()
{
	vec2 p = (gl_FragCoord.xy * 2.0 - uResolution.xy) / min(uResolution.x, uResolution.y);
	vec3 cPos = vec3(0.0, 0.0, 0.0);
	float t = -0.25 * PI;
	vec3 cDir = rotX(vec3(0.0, 0.0, -1.0), t);
	vec3 cUp = rotX(vec3(0.0, 1.0, 0.0), t);
	vec3 cSide = cross(cDir, cUp);
	float targetDepth = 1.0;
	vec3 ray = cSide * p.x + cUp * p.y + cDir * targetDepth - cPos;
	ray = normalize(ray);

	vec3 groundNormal = vec3(0,1,0);
	float groundHeight = 1.0;
	vec3 lPos = vec3(0.0);
	if(dot(groundNormal,ray) < 0.0) {
		vec3 hit = cPos - ray * groundHeight / dot(ray, groundNormal);
		// 勾配を加算
		groundNormal.zx += grad2(hit.zx);
		groundNormal = normalize(groundNormal);
		float diff = max(dot(groundNormal, normalize(lPos - hit)), 0);
		diff *= 1.5;
		diff /= pow(length(lPos - hit), 1.5);
		fragColor = vec4(diff);
	} else {
	    fragColor = TDOutputSwizzle(vec4(vec3(1.0), 1));
	}
}
