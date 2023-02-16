uniform float uTime;
uniform vec2 uResolution;
int channel;
const float PI = 3.141592;
const float TAU = 6.2831853;
#include "util"
out vec4 fragColor;

float fbm21(vec2 p, float g){
    float val = 0.0;
    float amp = 1.0;
    float freq = 1.0;
    for (int i = 0; i < 4; i++){
        val += amp * (vnoise21(freq * p) - 0.5);
        amp *= g;
        freq *= 2.01;
    }
    return 0.5 * val + 0.5;
}

float base21(vec2 p){
    return mod(uTime, 20.0) < 10.0 ?
    fbm21(p, 0.5) : 
    pnoise21(p);
}

float warp21(vec2 p, float g){
    float val = 0.0;
    for (int i = 0; i < 4; i++){
        val = base21(p + g * vec2(cos(TAU * val), sin(TAU * val)));
    }
    return val;
}

vec3 blend(float a, float b) {
	float time = abs(mod(0.1 * uTime, 2.0) - 1.0);
	vec3[2] col2;
	col2[0] = vec3(a,a,1);
	col2[1] = vec3(0,b,b);
	return channel == 0 ? mix(col2[0], col2[1], time) : mix(col2[0], col2[1], smoothstep(0.5 - 0.5 * time, 0.5 + 0.5 * time, b / (a + b)));
}

void main()
{
	vec2 p = gl_FragCoord.xy * 2 / min(uResolution.x, uResolution.y);
	channel = int(gl_FragCoord.x * 2 / uResolution.x);
	p = 10 * p + uTime;
	float a = warp21(p, 1);
	float b = warp21(p + 10, 1);
	fragColor = TDOutputSwizzle(vec4(vec3(blend(a,b)), 1));
}
