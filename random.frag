uniform float uTime;
uniform vec2 uResolution;

out vec4 fragColor;

float fractSin11(float x) {
	return fract(1000 * sin(x));
}

float fractSin21(vec2 xy) {
	return fract(sin(dot(xy, vec2(12.98989,78.212))) * 43759.3232); 
}

void main()
{
	vec2 pos = gl_FragCoord.xy;
	pos += floor(60 * uTime);
	int channel = int(gl_FragCoord.x * 2 / uResolution.x);
	if (channel == 0) {
		fragColor = TDOutputSwizzle(vec4(fractSin11(pos.x)));
	} else {
		fragColor = TDOutputSwizzle(vec4(fractSin21(pos.xy / uResolution.xy)));
	}
	fragColor.a = 1.0;
}
