
// Example Pixel Shader

// uniform float exampleUniform;
#include "util"

uniform float uTime;
uniform vec2 uResolution;
ivec2 channel;
//start vnoise
float vnoise21(vec2 p){
    vec2 n = floor(p);
    float[4] v;
    for (int j = 0; j < 2; j ++){
        for (int i = 0; i < 2; i++){
            v[i+2*j] = hash21(n + vec2(i, j));
        }
    }
    vec2 f = fract(p);
    f = f * f * f * (10.0 - 15.0 * f + 6.0 * f * f);
    return mix(mix(v[0], v[1], f[0]), mix(v[2], v[3], f[0]), f[1]);
}
float vnoise31(vec3 p){
    vec3 n = floor(p);
    float[8] v;
    for (int k = 0; k < 2; k++ ){
        for (int j = 0; j < 2; j++ ){
            for (int i = 0; i < 2; i++){
                v[i+2*j+4*k] = hash31(n + vec3(i, j, k));
            }
            
        }
    }
    vec3 f = fract(p);
    f = f * f * f * (10.0 - 15.0 * f + 6.0 * f * f);
    float[2] w;
    for (int i = 0; i < 2; i++){
        w[i] = mix(mix(v[4*i], v[4*i+1], f[0]), mix(v[4*i+2], v[4*i+3], f[0]), f[1]);
    }
    return mix(w[0], w[1], f[2]);
}
//end vnoise

//start gnoise
float gnoise21(vec2 p){
    vec2 n = floor(p);
    vec2 f = fract(p);
    float[4] v;
    for (int j = 0; j < 2; j ++){
        for (int i = 0; i < 2; i++){
            vec2 g = normalize(2.0 * hash22(n + vec2(i,j)) - vec2(1.0));
            v[i+2*j] = dot(g, f - vec2(i, j));
        }
    }
    f = f * f * f * (10.0 - 15.0 * f + 6.0 * f * f);
    return 0.5 * mix(mix(v[0], v[1], f[0]), mix(v[2], v[3], f[0]), f[1]) + 0.5;
}
float gnoise31(vec3 p){
    vec3 n = floor(p);
    vec3 f = fract(p);
    float[8] v;
    for (int k = 0; k < 2; k++ ){
        for (int j = 0; j < 2; j++ ){
            for (int i = 0; i < 2; i++){
                vec3 g = normalize(2.0 * hash33(n + vec3(i, j, k)) - vec3(1.0));
                v[i+2*j+4*k] = dot(g, f - vec3(i, j, k));
            }
        }
    }
    f = f * f * f * (10.0 - 15.0 * f + 6.0 * f * f);
    float[2] w;
    for (int i = 0; i < 2; i++){
        w[i] = mix(mix(v[4*i], v[4*i+1], f[0]), mix(v[4*i+2], v[4*i+3], f[0]), f[1]);
    }
    return 0.5 * mix(w[0], w[1], f[2]) + 0.5;
}

vec3 hsv2rgb(vec3 c) {
	vec3 rgb = clamp(abs(mod(c.x * 6.0 + vec3(0.0,4.0, 2.0), 6.0) -3.0)-1.0, 0.0,1.0);
	return c.z * mix(vec3(1.0), rgb, c.y);
}
out vec4 fragColor;

void main()
{
	vec2 pos = gl_FragCoord.xy / min(uResolution.x, uResolution.y);
	pos = 20.0 * pos + uTime;
	float v;
	if (channel[0] == 0) {
		if (channel[1] == 0) {
			v = vnoise21(pos);
		} else {
			v = vnoise31(vec3(pos, uTime));
		}
	} else {
		if (channel[1] == 0) {
			v = gnoise21(pos);
		} else {
			v = gnoise31(vec3(pos, uTime));
		}
	}
	fragColor = TDOutputSwizzle(vec4(hsv2rgb(vec3(v,1,1)),1));
}
