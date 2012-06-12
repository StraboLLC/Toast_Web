# Load the rails application
require File.expand_path('../application', __FILE__)

# Initialize the rails application
Toast::Application.initialize!

require "aws/s3"
con = AWS::S3::Base.establish_connection!(
  :access_key_id => ENV['AMAZON_ACCESS_KEY_ID'],
  :secret_access_key => ENV['AMAZON_SECRET_ACCESS_KEY']
)
aws_bucket = ENV['AMAZON_TOAST_BUCKET']