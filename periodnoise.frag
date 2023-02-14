float periodNoise21(vec2 p, float period) {
	vec2 n = floor(p);
	vec2 f = fract(p);

	float[4] v;

	for (int j = 0; j < 2; j++) {
		for (int i = 0; i < 2; i++) {
			v[i + 2 * j] = gtable2(mod(n + vec2(i, j), period), f - vec2(i, j));
		}
	}
	f = f * f * f * (10.0 - 15.0 * f + 6.0 * f * f);
    return 0.5 * mix(mix(v[0], v[1], f[0]), mix(v[2], v[3], f[0]), f[1]) + 0.5;
}
