uniform float uTime;
uniform vec2 uResolution;
ivec2 channel;
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
float converter(float v) {
	float time = abs(mod(0.1 * uTime, 2.0) - 1.0);
	float n = floor(8.0 * time);
	return channel == ivec2(1, 0) ? step(time, v) : 
        channel == ivec2(2, 0) ? (floor(n * v) + step(0.5, fract (n * v))) / n :
        channel == ivec2(0, 1) ? smoothstep(0.5 * (1.0 - time), 0.5 * (1.0 + time), v): 
        channel == ivec2(1, 1) ? pow(v, 2.0 * time) : 
        channel == ivec2(2, 1) ? 0.5 * sin(2.0 *  TAU * v +  uTime) + 0.5 :
        v;
}
void main()
{
	vec2 p = gl_FragCoord.xy * 2 / min(uResolution.x, uResolution.y);
	channel = ivec2(gl_FragCoord.xy * vec2(3,2) / uResolution.xy); // ｘ３ほうこうに3倍して3列　ｙ方向に2倍して2列
	p = 10.0 * p + uTime;
	fragColor = TDOutputSwizzle(vec4(vec3(converter(warp21(p, 1))),1));
}
