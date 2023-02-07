uniform vec2 uResolution;
out vec4 fragColor;

void main()
{
	vec2 position = (gl_FragCoord.xy / uResolution.xy);;
	position.x *= 2;
	vec3[3] colors = vec3[](
	vec3(1,0,0),
	vec3(0,1,0),
	vec3(0,0,1) 
	);
	int index = int(position.x); // 0or1or2
	vec3 finalColor = mix(colors[index],colors[index + 1], fract(position.x));
	fragColor = TDOutputSwizzle(vec4(finalColor, 1));
}
