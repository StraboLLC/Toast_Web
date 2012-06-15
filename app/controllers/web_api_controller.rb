class WebApiController < ApplicationController

	def geo_data
		token = params[:data_token]
		if token
			@r = RestClient.get 'http://s3.amazonaws.com/'+ENV['AMAZON_TOAST_BUCKET']+'/'+token+'/'+token+'_geo_data.json' do |response, request, result, &block|
				case response.code
				when 200
					@r = response
				when 500
					@r = WebApiError.new 500, "Internal Server Error"
				when 404
					@r = WebApiError.new 404, "Resource Not Found"
				end
			end

		else
			@r = WebApiError.new 500, "Did not pass a 'data_token' parameter"
		end
		render :json => @r
	end

	def album_captures
		token = params[:data_token]
		if token
			@album = Album.where(:token => token).first
			@r = WebApiResponse.new
			@r.token = token
			@r.album = @album
			@r.captures = @album.captures
		else
			@r = WebApiError.new 500, "Did not pass a 'data_token' parameter"
		end
		render :json => @r
	end

	##
	# A Class to hold Web related API Errors.
	class WebApiError
		
		def initialize error_number, error_string
			@err_num = error_number
			@err = error_string
		end

	end
	class WebApiResponse
		attr_accessor :token, :album, :captures
		def initialize
			@err_num=0
			@err="No Error"
		end
	end
end
