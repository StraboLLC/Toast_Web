class ApplicationController < ActionController::Base
  protect_from_forgery
  # force_ssl




end




def head_assets (name)
	content_for(:head) { javascript_include_tag(name) }
	content_for(:head) { stylesheet_link_tag(name) }
end