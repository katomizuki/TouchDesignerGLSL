
uniform vec2 uResolution;
uniform float uTime;
out vec4 fragColor;
mat2 rotate2d(float angle) {
	return mat2(cos(angle) , -sin(angle), sin(angle), cos(angle));
}
mat2 scale(vec2 scale) {
	return mat2(scale.x, 0, 0, scale.y);
}
void main()
{
	vec2 p = (gl_FragCoord.xy * 2 - uResolution) / min(uResolution.x, uResolution.y);
	p -= 0.5;
	p *= rotate2d(uTime);
	p *= scale(vec2(fract(-uTime) * 3));
	p += 0.5;
	vec4 color = vec4(1.0);
	fragColor = TDOutputSwizzle(color);
}

