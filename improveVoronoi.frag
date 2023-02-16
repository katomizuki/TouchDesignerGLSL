uniform float uTime;
uniform vec2 uResolution;
#include "util"
int channel;

out vec4 fragColor;
float fdist21(vec2 p) {
	vec2 n = floor(p + 0.5);
	float dist = sqrt(2.0);
	for (float j = 0.0; j <= 2.0; j++) {
		vec2 glid;
		glid.y = n.y + sign(mod(j, 2.0) - 0.5) * ceil(j * 0.5);
		if (abs(glid.y - p.y) - 0.5 > dist) {
				continue;
			}
		for (float i = -1.0; i <= 1.0; i++) {
			glid.x = n.x + i;
			vec2 jitter = hash22(glid) - 0.5;
			dist = min(dist, length(glid + jitter - p));
		}
	}
	return dist;
}

float fdist31(vec3 p){
    vec3 n = floor(p + 0.5);
    float dist = sqrt(3.0);
    for(float k = 0.0; k <= 2.0; k ++ ){
            vec3 glid;
            glid.z = n.z + sign(mod(k, 2.0) - 0.5) * ceil(k * 0.5);
            if (abs(glid.z - p.z) - 0.5 > dist){
                continue;
            }
        for(float j = 0.0; j <= 2.0; j ++ ){
            glid.y = n.y + sign(mod(j, 2.0) - 0.5) * ceil(j * 0.5);
            if (abs(glid.y - p.y) - 0.5 > dist){
                continue;
            }
            for(float i = -1.0; i <= 1.0; i ++ ){
                glid.x = n.x + i;
                vec3 jitter = hash33(glid) - 0.5;
                dist = min(dist, length(glid + jitter - p));
            }
        }
    }
    return dist;
}
void main()
{
	vec2 pos = gl_FragCoord.xy * 2 / min(uResolution.x, uResolution.y);
	channel = int(gl_FragCoord.x * 2 / min(uResolution.x,uResolution.y));
	pos *= 10;
	pos += uTime;
	fragColor = TDOutputSwizzle(channel == 0 ? vec4(vec3(fdist21(pos)),1) : vec4(vec3(fdist31(vec3(pos, uTime))),1));
}
