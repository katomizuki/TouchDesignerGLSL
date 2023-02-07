uniform vec2 uResolution;
uniform float uTime;
out vec4 fragColor;

void main()
{
	vec2 position = gl_FragCoord.xy / uResolution.xy;
	float numberOfSteps = 4.0;
	position *= numberOfSteps; // 0 ~ 4
	vec3[4] colors = vec3[](
		vec3(1,0,0),
		vec3(1,1,0),
		vec3(1,0,1),
		vec3(1,1,1)
	);
	int channel = int(2.0 * gl_FragCoord.x / uResolution.x); // 0or1or2
	if (channel == 0) { // step
		position = floor(position) + step(0.5, fract(position));
	} else { // smoothstep
		float thr = 0.25 * sin(uTime);
		position = floor(position) + smoothstep(0.25 + thr,0.75 - thr, fract(position));
	}
	position /= numberOfSteps; // 0 ~ 1
	vec3 finalColor = mix(mix(colors[0], colors[1], position.x), mix(colors[2], colors[3], position.x), position.y);
	fragColor = TDOutputSwizzle(vec4(finalColor, 1));
}
