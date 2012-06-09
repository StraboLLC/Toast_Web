require "digest"
class ApplicationController < ActionController::Base
	protect_from_forgery
	# force_ssl


	# Includes the relevant Javascript and CSS files in each page.
	def head_assets (name)
		content_for(:head) { javascript_include_tag(name) }
		content_for(:head) { stylesheet_link_tag(name) }
	end
	# Hashes a String and Returns an MD5 String
	def md5 hash
		return Digest::MD5.hexdigest(hash).to_s
	end
end



