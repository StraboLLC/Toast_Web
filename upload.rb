
token = ARGV[0]
type = ARGV[1]
if token && type
  type_string = ".mov;type=video/quicktime" if type == "video"
  type_string = ".jpg;type=image/jpeg" if type == "photo"
  type_string = ".txt;type=text/plain" if type == "note"
  type_string = ".m4a;type=audio/m4a" if type == "audio"

  system "curl -F 'email=will@willpots.com' -F 'token=903a04b16a8280ed082936d534adc6f9' -F 'capture_info=@sample_track/#{token}.json;type=application/json' -F 'geo_data=@sample_track/#{token}_geo_data.json;type=application/json' -F 'media_file=@sample_track/#{token}#{type_string}' -F 'thumbnail=@sample_track/#{token}.jpg;type=image/jpeg' http://localhost:3000/mobile/api/upload > index.html"
else
  puts "usage: ruby upload.rb <TOKEN>"
end
