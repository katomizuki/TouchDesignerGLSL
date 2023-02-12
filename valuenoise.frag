#include "shaderUtil"

uniform float uTime;
uniform vec2 uResolution;
int channel;

out vec4 fragColor;

/// 2DValue Noise
float vnoise21(vec2 p) {
	vec2 n = floor(p);
	float[4] v;
	for(int i = 0; i < 2; i++) {
		for (int j = 0; j < 2; j++) {
			v[i + 2 * j] = hash21(n + vec2(i, j));
		}
	}

	vec2 f = fract(p);
	f = f * f * (3.0 - 2.0 * f);
	return mix(mix(v[0], v[1],f[0]), mix(v[2], v[3],f[0]), f[1]); 
}
/// 3DValue Noise
float vnoise31(vec3 p) {
	vec3 n = floor(p);
	float[8] v;
	for(int k = 0; k < 2; k++) {
		for(int j = 0; j < 2; j++) {
			for (int i = 0; i < 2; i++) {
				v[i + 2 * j + 4 * k] = hash31(n + vec3(i, j, k));
			}
		}
	}
	vec3 f = fract(p);
	f = f * f * (3.0 - 2.0 * f);
	float[2] w;
	for (int i = 0; i < 2; i++) {
		w[i] = mix(mix(v[4 * i], v[ 4 * i + 1],f[0]), mix(v[4 * i + 2],v[4 * i + 3], f[0]),f[1]);
	}
	return mix(w[0], w[1],f[2]);
}

void main()
{
	vec2 pos = gl_FragCoord.xy / uResolution.xy;
	channel = int(gl_FragCoord.x * 3 / uResolution.x);
	pos = 10 * pos + uTime;
	if (channel == 2) {
		fragColor = TDOutputSwizzle(vec4(vnoise21(pos)));
	} else {
		fragColor = TDOutputSwizzle(vec4(vnoise31(vec3(pos, uTime))));
	}
}
