require "aws/s3"
AMAZON_ACCESS_KEY_ID="AKIAJOULK3IV4RKHDUFA"
AMAZON_SECRET_ACCESS_KEY="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"
AMAZON_TOAST_BUCKET="dev.toast.data"


con = AWS::S3::Base.establish_connection!(
  :access_key_id => AMAZON_ACCESS_KEY_ID,
  :secret_access_key => AMAZON_SECRET_ACCESS_KEY
)
aws_bucket = AMAZON_TOAST_BUCKET