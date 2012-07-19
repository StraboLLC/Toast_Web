class Capture < ActiveRecord::Base
	belongs_to :album

	before_destroy :remove_s3_stuff

	def remove_s3_stuff
		token = self[:token]
		AWS::S3::S3Object.delete(token+"/"+token+".json", AMAZON_TOAST_BUCKET) if AWS::S3::S3Object.exists?(token+"/"+token+".json", AMAZON_TOAST_BUCKET)
		AWS::S3::S3Object.delete(token+"/"+token+"_geo_data.json", AMAZON_TOAST_BUCKET) if AWS::S3::S3Object.exists?(token+"/"+token+"_geo_data.json", AMAZON_TOAST_BUCKET)
		AWS::S3::S3Object.delete(token+"/"+token+"-thumb.jpg", AMAZON_TOAST_BUCKET) if AWS::S3::S3Object.exists?(token+"/"+token+"-thumb.jpg", AMAZON_TOAST_BUCKET)
		AWS::S3::S3Object.delete(token+"/"+token+".jpg", AMAZON_TOAST_BUCKET) if AWS::S3::S3Object.exists?(token+"/"+token+".jpg", AMAZON_TOAST_BUCKET)
		AWS::S3::S3Object.delete(token+"/"+token+".mov", AMAZON_TOAST_BUCKET) if AWS::S3::S3Object.exists?(token+"/"+token+".mov", AMAZON_TOAST_BUCKET)
		AWS::S3::S3Object.delete(token+"/"+token+".txt", AMAZON_TOAST_BUCKET) if AWS::S3::S3Object.exists?(token+"/"+token+".txt", AMAZON_TOAST_BUCKET)
		AWS::S3::S3Object.delete(token+"/"+token+".m4a", AMAZON_TOAST_BUCKET) if AWS::S3::S3Object.exists?(token+"/"+token+".m4a", AMAZON_TOAST_BUCKET)
		AWS::S3::S3Object.delete(token+"/"+token+".mp4", AMAZON_TOAST_BUCKET) if AWS::S3::S3Object.exists?(token+"/"+token+".mp4", AMAZON_TOAST_BUCKET)
		AWS::S3::S3Object.delete(token+"/"+token+".webm", AMAZON_TOAST_BUCKET) if AWS::S3::S3Object.exists?(token+"/"+token+".webm", AMAZON_TOAST_BUCKET)
	end

end
