int channel;
uniform float uTime;
uniform vec2 uResolution;
#include "util"

out vec4 fragColor;

float base21(vec2 p) {
	return channel == 0 ? vnoise21(p) - 0.5 : pnoise21(p) - 0.5;
}
///  p => 0 + uTime ~ 10 + uTime 
float fbm21(vec2 p, float g){ 
	// 値の初期値
	float val = 0.0;
	// ふり幅　amplitude
	float amp = 1.0;
	// 周波数の周期の重み
	float freq = 1.0;
	// ampが小さくなるにつれてfreqが大きくなり倍々になっていくことにより自己相似性が実現できている。
	for (int i = 0; i < 4; i++) {
		val += amp * base21(freq * p);
		// 時間によって0　～１が重みとして乗算される
		amp *= g;
		freq *= g;
		freq *= 2.01;
	}
	return 0.5 * val + 0.5;
}

void main()
{
	vec2 p = gl_FragCoord.xy * 2 / min(uResolution.x, uResolution.y);
	channel = int(gl_FragCoord.x * 2 / uResolution.x);
	p = 10.0 * p + uTime;
	// 時間を除算した余りから１を引いた絶対値 0 ~ 1
	float g = abs(mod(0.2 * uTime, 2.0) - 1.0);
	fragColor = TDOutputSwizzle(vec4(vec3(fbm21(p, g)), 1.0));
}
