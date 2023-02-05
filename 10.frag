uniform vec2 uResolution;
out vec4 fragColor;
void main()
{
	vec2 p = (gl_FragCoord.xy * 2) / min(uResolution.x, uResolution.y); 
	fragColor = TDOutputSwizzle(vec4(1.0,p,1.0));
}
