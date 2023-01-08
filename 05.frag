uniform float uAmount;
out vec4 fragColor;
void main()
{
	vec2 p = vUV.st;
	float d = uAmount;
	p.x = (floor(p.x * d) / d + ceil(p.x * d) / d) / 2; // 0 ~ 1 に正規化 0.1,0.2みたいなやつが入る floorとceilの平均をuserとった方がよいモザイクになる。
	p.y = (floor(p.y * d) / d + ceil(p.y * d) / d) / 2;

	vec4 color = texture(sTD2DInputs[0], p);
	// color = vec4(p, 0.0, 1.0);
	fragColor = TDOutputSwizzle(color);
}
