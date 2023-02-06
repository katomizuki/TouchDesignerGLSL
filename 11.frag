uniform vec2 uResolution;

out vec4 fragColor;
void main()
{
	vec2 p = (gl_FragCoord.xy * 2) / min(uResolution.x, uResolution.y);
	vec3 red = vec3(1.0,0.0,0.0);
	vec3 blue = vec3(0.0,0.0,1.0); 
	vec3 finalColor = mix(red, blue,p.y);
	fragColor = TDOutputSwizzle(vec4(finalColor, 1));
}
