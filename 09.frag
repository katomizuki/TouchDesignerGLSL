layout(location = 0) out vec4 color_uv;
layout(location = 1) out vec4 color_1;
layout(location = 2) out vec4 color_2;
layout(location = 3) out vec4 color_add;
layout(location = 4) out vec4 color_multiply;
layout(location = 5) out vec4 color_difference;

uniform vec2 uResolution;
out vec4 fragColor;
void main()
{
	vec2 p = vec2(gl_FragCoord.xy * 2 - uResolution) / min(uResolution.x, uResolution.y);
	
	vec4 colorUV = vec4(p, 0.0, 1.0);

	vec4 color1 = vec4(1.0);
	color1.rgb = vec3(sin(p.x * 4));

	vec4 color2 = vec4(1.0);
	color2.rgb = vec3(sin(p.y * 4));

	vec4 colorAdd = vec4(1.0);
	colorAdd.rgb = vec3(color1.rgb + color2.rgb);

	vec4 colorMultiply = vec4(1.0);
	colorMultiply.rgb = vec3(color1.rgb * color2.rgb);

	vec4 colorDifference = vec4(1.0);
	colorDifference.rgb = vec3(color1.rgb - color2.rgb);

	color_uv = TDOutputSwizzle(colorUV);
	color_1 = TDOutputSwizzle(color1);
	color_2 = TDOutputSwizzle(color2);
	color_add = TDOutputSwizzle(colorAdd);
	color_multiply = TDOutputSwizzle(colorMultiply);
	color_difference = TDOutputSwizzle(colorDifference);
}

