uniform float uTime;
uniform vec2 uResolution;
#include "util"
out vec4 fragColor;
float fdist(vec2 p) {
	vec2 center = floor(p + 0.5);
	float dist = sqrt(2.0);
	for(float j = -2.0; j <= 2.0; j++) {
		for(float i = -2.0; i <= 2.0; i++) {
			vec2 glid = center + vec2(i, j);
			vec2 jitter = sin(uTime) * (hash22(glid) - 0.5);
			dist = min(dist, distance(glid + jitter, p));
		}
	}
	return dist;
}
void main()
{
	vec2 pos = gl_FragCoord.xy / min(uResolution.x , uResolution.y);
	pos *= 10.0;
	pos += uTime;
	fragColor = TDOutputSwizzle(vec4(vec3(fdist(pos)),1));
}
