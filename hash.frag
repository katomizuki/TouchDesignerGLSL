uniform float uTime;
uint k = 0x456789abu;
const uint UINT_MAX = 0xfffffffffu;
uint uhash(uint n) {
	n ^= (n << 1);
	n ^= (n >> 1);
	n *= k;
	n ^= (n << 1);
	return n * k;
}

float hash11(float p) {
	uint n = floatBitsToUint(p);
	return float(uhash(n)) / float(UINT_MAX);
}


out vec4 fragColor;
void main()
{
	float time = 60 * uTime;
	vec2 pos = gl_FragCoord.xy + time;
	fragColor = TDOutputSwizzle(vec4(vec3(hash11(pos.x)), 1));
}
