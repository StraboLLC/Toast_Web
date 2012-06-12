con = AWS::S3::Base.establish_connection!(
  :access_key_id => ENV['AMAZON_ACCESS_KEY_ID'],
  :secret_access_key => ENV['AMAZON_SECRET_ACCESS_KEY']
)
aws_bucket = ENV['AMAZON_TOAST_BUCKET']
puts "** AMAZON CON='#{con.inspect}'"