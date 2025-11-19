<?php

/**
 * Plugin Name: Cover Block Parallax
 * Description: Adds parallax effect to the cover block background image.
 * Version: 1.0.0
 * Author: Jacob Lodes
 */

// Exit if accessed directly.
if (! defined('ABSPATH')) {
    exit;
}

// Enqueue the JavaScript file.
function cbp_enqueue_scripts_and_styles()
{
    wp_enqueue_script(
        'cover-block-parallax-script',
        plugin_dir_url(__FILE__) . '/build/scripts/front-end.min.js',
        [],
        '1.0.0',
        true
    );

    wp_enqueue_style(
        'cover-block-parallax-style',
        plugin_dir_url(__FILE__) . '/build/styles/front-end.min.css',
        [],
        '1.0.0'
    );
}
add_action('wp_enqueue_scripts', 'cbp_enqueue_scripts_and_styles');
