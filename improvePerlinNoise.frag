
out vec4 fragColor;
uniform vec2 uResolution;
uniform float uTime;
#include "util"
float gnoise21(vec2 p) {
	vec2 n = floor(p);
	vec2 f = fract(p);
	float[4] v;
	for(int j = 0;  j < 2; j ++) {
		for (int i = 0; i < 2; i ++) {
			vec2 g = normalize(2.0 * hash22(n + vec2(i + j)) - vec2(1.0));
			v[i + 2 * j] = dot(g, f- vec2(i,j));
		}
	}
	f = f * f * f * (10.0 - 15.0 * f + 6.0 * f * f);
	return 0.5 * mix(mix(v[0],v[1],f[0]), mix(v[2],v[3], f[0]),f[1]) + 0.5;
}

float gnoise31(vec3 p) {
	vec3 n = floor(p);
	vec3 f = fract(p);
	float[8] v;
	for (int k = 0; k < 2; k++) {
		for (int j = 0; j < 2; j++) {
			for (int i = 0; i < 2; i++) {
				vec3 g = normalize(2.0 * hash33(n + vec3(i,j,k)) - vec3(1.0));
				v[i + 2 * j + 4 * k] = dot(g, f - vec3(i, j, k));
			}
		}
	}

	f = f * f * f * (10.0 - 15.0 * f + 6.0 * f * f);
	float[2] w;
	for (int i = 0; i < 2; i++) {
		w[i] = mix(mix(v[4 * i], v[4 * i + 1],f[0]), mix(v[ 4 * i + 2], v[ 4 * i + 3], f[0]), f[1]);
	}
	return 0.5 * mix(w[0], w[1], f[2]) + 0.5;
}

int channel;

void main()
{
	vec2 pos = gl_FragCoord.xy * 2 / min(uResolution.x, uResolution.y);
	channel = int(gl_FragCoord.x * 2.0 / uResolution.x);
	pos = 10 * pos + uTime;
	if (channel < 1) {
		fragColor = TDOutputSwizzle(vec4(gnoise21(pos)));
	} else {
		fragColor = TDOutputSwizzle(vec4(gnoise31(vec3(pos, uTime))));
	}
	fragColor.a = 1.0;
}
