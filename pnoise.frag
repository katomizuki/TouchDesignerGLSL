uniform float uTime;
ivec2 channel;
uniform vec2 uResolution;
#include "hash"
#include "gnoise"

out vec4 fragColor;
float gtable2(vec2 lattice, vec2 p) {
	uvec2 n = floatBitsToUint(lattice);
	uint ind = uhash22(n).x >> 29;
	float u = 0.923232 * (ind < 4u ? p.x : p.y);
	float v = 0.382932 * (ind < 4u ? p.y : p.x);
	return ((ind & 1u) == 0u ? u : -u) + ((ind & 2u) == 0u ? v : -v);
}

float pnoise21(vec2 p) {
	vec2 n = floor(p);
	vec2 f = fract(p);
	float[4] v;
	for (int j = 0; j < 2; j++) {
		for (int i = 0 ; i < 2; i++) {
			v[i + 2 * j] = gtable2(n + vec2(i, j ),f - vec2(i, j));
		}
	}
	f = f * f * f * (10.0 - 15.0 * f + 6.0 * f * f);
    return 0.5 * mix(mix(v[0], v[1], f[0]), mix(v[2], v[3], f[0]), f[1]) + 0.5;
}

float gtable3(vec3 lattice, vec3 p){
    uvec3 n = floatBitsToUint(lattice);
    uint ind = uhash33(n).x >> 28;
    float u = ind < 8u ? p.x : p.y;
    float v = ind < 4u ? p.y : ind == 12u || ind == 14u ? p.x : p.z;
    return ((ind & 1u) == 0u? u: -u) + ((ind & 2u) == 0u? v : -v);
}

float pnoise31(vec3 p) {
	vec3 n = floor(p);
	vec3 f = fract(p);
	float[8] v;
	for(int k = 0; k < 2; k++) {
		for (int j = 0; j < 2; j++) {
			for (int i = 0; i < 2; i++) {
				v[i + 2 * j + 4 * k ] = gtable3(n + vec3(i, j, k), f - vec3(i, j, k)) * 0.70710678;
			}
		}
	}
	f = f * f * f * ( 10.0 - 15.0 * f + 6.0 * f  * f);
	float[2]  w;
	for (int i = 0; i < 2; i++) {
		w[i] = mix(mix(v[4 * i], v[4 * i + 1], f[0]), mix(v[4 * i + 2], v[4 * i + 3],f[0]), f[1]);
	}
	return 0.5 * mix(w[0], w[1], f[2]) + 0.5;
}

void main()
{
	vec2 pos = gl_FragCoord.xy / min(uResolution.x , uResolution.y);
	pos = 10.0 * pos + uTime;
	channel = ivec2(2.0 * gl_FragCoord.xy / uResolution.xy);
	 float v = channel[0] == 0 ? 
        channel[1] == 0 ? gnoise21(pos) :
        gnoise31(vec3(pos, uTime)) :
        channel[1] == 0 ? pnoise21(pos) : 
        pnoise31(vec3(pos, uTime));
    fragColor.rgb = vec3(v);
    fragColor.a = 1.0;
}
