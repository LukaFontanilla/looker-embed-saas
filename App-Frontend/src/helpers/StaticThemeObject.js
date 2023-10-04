export const StaticThemeObject = (type, dark) => {

    const theme = {
        dashboardDark: encodeURIComponent(JSON.stringify({
            show_filters_bar:false,
            show_title:false,
            background_color:'rgb(24,24,27)',
            tile_background_color:"transparent",
            title_text_color:"black",
            font_color:"black",
            title_color:"black",
            text_tile_text_color:"black",
        })),
        dashboardLight: JSON.stringify({
            show_filters_bar:false,
            show_title:false,
            background_color:'transparent',
            // tile_background_color:"rgb(24,24,27)",
            title_text_color:"black",
            font_color:"black",
            title_color:"black",
            text_tile_text_color:"black",
        }),
        look: encodeURIComponent(JSON.stringify({
            show_filters_bar:false,
            show_title:false
        })),
        explore: JSON.stringify({
            show_explore_header: false,
            show_explore_title: false,
            background_color: '#f6e7f2',
            base_font_size: '12px'
        }),
    }

    return theme[type + (dark ? 'Dark' : 'Light')]
}