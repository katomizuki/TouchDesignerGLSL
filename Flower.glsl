uniform float time;
uniform vec2 resolution;
out vec4 fragColor;

float rand(vec2 uv)
{
    return fract(sin(dot(uv, vec2(12.9898, 78.233))) * 43758.5453);
}

void main()
{
	// PI
	const float pi = 3.1415926;
	// y方向に５分割
    float scale = resolution.y / 5;

//　現在見ている座標に五分割したことを考慮したいので/ scaleで除算
    vec2 p = gl_FragCoord.xy / scale;
	// 時間変数を０．６倍して乱数を加えた値をｔとして使用する。
    float t = time * 0.6 + rand(floor(p)) * 200;
    
	// 時間によって縮小拡大するためのスケーラー
    float s2 = 1.6 + sin(t);
	// 花びらのスケール｡中心座標を真ん中にしてあげる。
    p = (fract(p) - 0.5) * s2; // repeat and scale
    scale /= s2;

    float d1 = 1e6; // distance field (petal)
    float d2 = 0;   // distance field (cut)
// 花びらの数
    for (int i = 0; i < 5; i++)
    {
		// 花びらを5枚作成するために等間隔で割る　時間ごとに動しつつ
        float phi = pi * (2.0 * i / 5 + 0.1) + t;

// 花びらの外向きのベクトル
        vec2 v1 = vec2(cos(phi), sin(phi)); // outward vector
		// ｖ１に対して垂直なベクトルを定義
        vec2 v2 = vec2(-v1.y, v1.x);        // vertical vector
		// 花びらの先端のカットしている部分 ‐0.5などは先端のカットの開き具合を調整している。PIは花びらの中心角度に当たる。
        vec2 v3 = vec2(cos(phi - 0.5), sin(phi - 1)); // cut line 1
        vec2 v4 = vec2(cos(phi + 1), sin(phi + 1)); // cut line 2

/// 現在見ているPからベクトル1（花びらの高さベクトルとv2花びらの幅ベクトル）の差分ベクトルの大きさと合計ベクトルの距離をくらべて
// どちらが大きいか確認。それを再帰的に繰り返していく＝＞ハナビラノ内側かどうかを判断
        d1 = min(d1, max(distance(p, v1 * 0.27 - v2 * 0.15),
                         distance(p, v1 * 0.27 + v2 * 0.15)));

        d2 = max(d2, min(dot(v3, p) - dot(v3, v1 * 0.4),
                         dot(v4, p) - dot(v4, v1 * 0.4)));
    }

    vec2 c12 = vec2(1) - vec2(d1 - 0.29, d2) * scale;
    vec3 c = max(vec3(1, 0.7, 0.7) + p.y, 0) * min(c12.x, c12.y);
	vec4 color = vec4(c, 1);
	fragColor = TDOutputSwizzle(color);
}
