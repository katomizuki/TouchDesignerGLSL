uniform float uTime;
uniform vec2 uResolution;
#include "util"
int channel;

out vec4 fragColor;
float fdist(vec2 p) {
	vec2 n = floor(p);
	float dist = sqrt(2.0);
	for(float j = 0.0; j <= 2.0; j++) {
		vec2 glid;
		glid.y = n.y + sign(mod(j, 2.0)- 0.5) * ceil(j * 0.5);
		if(abs(glid.y - p.y) - 0.5 > dist) {
			continue;
		}
		for(float i = -1.0; i <= 1.0; i++) {
			glid.x = n.x + i;
			vec2 jitter = hash22(glid) - 0.5;
			dist = min(dist, length(glid + jitter - p));
		}
	}
	return dist;
}

vec2 grad(vec2 p){
    float eps = 0.001;
    return 0.5 * (vec2(
            fdist(p + vec2(eps, 0.0)) - fdist(p - vec2(eps, 0.0)),
            fdist(p + vec2(0.0, eps)) - fdist(p - vec2(0.0, eps))
        )) / eps;
}

void main()
{
	vec2 pos = gl_FragCoord.xy * 2 / min(uResolution.x, uResolution.y);
	channel = int(gl_FragCoord.x * 2 / uResolution.x);
	pos *= 10.0;
	fragColor = TDOutputSwizzle(channel == 0 ? vec4(fdist(pos)) : vec4(grad(pos), 1, 1));
}
