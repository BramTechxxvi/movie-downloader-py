from app.services.media_service import detect_provider






def test_detect_provider_returns_youtube_for_youtube_url():
    url = "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
    result = detect_provider(url)
    
    assert result == "youtube"
    
    
    
def test_detect_provider_returns_youtube_for_youtube_short_url():
    url = "https://youtu.be/dQw4w9WgXcQ"
    result = detect_provider(url)
    
    assert result == "youtube"
    
    
    
def test_detect_provider_returns_rednot_for_rednote_url():
    url = "https://www.rednote.com/explore/example"
    result = detect_provider(url)
    
    assert result == "rednote"
    
    
    
def test_detect_provider_returns_protected_for_disney_plus():
    url = "https://www.disneyplus.com/movies/example"
    result = detect_provider(url)
    
    assert result == "protected"
    assert result != "disney"
    
    
def test_detect_provider_returns_protected_for_hulu():
    url = "https://www.hulu.com/watch/example"
    result = detect_provider(url)
    
    assert result == "protected"
    assert result != "hulu"
    
    
    
def test_detect_provider_rveurns_generic_for_other_urls():
    url = "https://vimeo.com/123456789"
    result = detect_provider(url)
    
    assert result == "generic"