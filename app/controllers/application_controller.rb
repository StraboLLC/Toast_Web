require "digest"
class ApplicationController < ActionController::Base
	protect_from_forgery
	# force_ssl

	# Hashes a String and Returns an MD5 String
	def md5 hash
		return Digest::MD5.hexdigest(hash).to_s
	end
end



