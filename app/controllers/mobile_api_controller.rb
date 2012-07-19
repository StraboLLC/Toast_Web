# require 'RMagick'
# include Magick

class MobileApiController < ApplicationController
  ##
  # Creates a new user from the Mobile Application
  # ==== Parameters
  # +name+, +email+, +password+, +token+
  # ==== Returns
  # +user_id+, +error_number+
  # ==== Example
  # <code>POST /mobile/api/register/?name=NAME&email=EMAIL&password=PASSWORD&token=TOKEN</code>
  # curl -d "name=Will Potter&email=jdoe@jdoe.com&password=8893dc16b1b2534bab7b03727145a2bb&token=9eed386b862a483d95efcf5555ec2010" http://localhost:3000/mobile/api/register
  def register
    if params[:token]==md5(params[:email].to_s+"fuckch0p")
      @user = User.new
      @user.name = params[:name]
      @user.email = params[:email]
      @user.password = params[:password]
      if @user.save
        @r = MobileApiResponse.new
        @r.user_id = @user.id
        @r.token = md5(@user.id.to_s + "g04ts")
      else
        @r = MobileApiError.new 3
      end
    else
      @r = MobileApiError.new 1
    end
    render :json => @r
  end
  ##
  # Logs in a user from the mobile application
  # ==== Parameters
  # +email+, +password_digest+, +token+
  # ==== Returns
  # +user_id+, +error_present+, +token+, +error_number+
  # ==== Example
  # <code>POST /mobile/api/login/?name=NAME&email=EMAIL&password=PASSWORD&token=TOKEN</code>
  # curl -d "email=will@willpots.com&token=903a04b16a8280ed082936d534adc6f9&password=1f3870be274f6c49b3e31a0c6728957f" http://localhost:3000/mobile/api/login
  def login
    if params[:token]==md5(params[:email].to_s+"fuckch0p")
      @user = User.authenticate params[:email], params[:password]
      if @user
        @r = MobileApiResponse.new
        @r.user_id = @user.id
        @r.token = md5(@user.id.to_s + "g04ts")
      else
        @r = MobileApiError.new 3
      end
    else
      @r = MobileApiError.new 1
    end
    render :json => @r
  end
  ##
  # Uploads media from the mobile phone and stores it on the site. If the media is tagged with an album token that does not exist,
  # it creates a new album as well.
  # ==== Parameters
  #
  # ==== Returns
  #
  # ==== Example
  # <code>POST /mobile/api/upload/</code>
  # curl -F "email=will@willpots.com" -F "token=903a04b16a8280ed082936d534adc6f9" -F "capture_info=@sample_info.json;type=application/json" -F "media_file=@sample_video.mov;type=video/quicktime" -F "geo_data=@sample_geo_data.json;type=application/json" -F "thumbnail=@sample_thumbnail.jpg;type=image/jpeg" http://localhost:3000/mobile/api/upload
  #
  def upload
    if params[:token]==md5(params[:email].to_s+"fuckch0p")
      if params[:email]
        @user = User.where(:email => params[:email].to_s).first
        if @user
          if params[:capture_info] && params[:media_file] && params[:geo_data] && params[:thumbnail]
            @r = MobileApiResponse.new
            aws_bucket = AMAZON_TOAST_BUCKET
            capture_info = params[:capture_info]
            media_file = params[:media_file]
            geo_data = params[:geo_data]
            thumbnail = params[:thumbnail]
            json = JSON(capture_info.read)
            finished=true
            if media_file.content_type == "image/jpeg"
              capture_type = "photo"
              media_file_name = ".jpg"
            elsif media_file.content_type == "video/quicktime"
              capture_type = "video"
              finished=false
              media_file_name = ".mov"
            elsif media_file.content_type == "text/plain"
              capture_type = "note"
              media_file_name = ".txt"
            elsif media_file.content_type == "audio/m4a"
              capture_type = "audio"
              media_file_name = ".aac"
            end

            # Fill In Album Information to Database
            @album = Album.where(:token => json["album_token"]).first
            @album = Album.new if !@album
            @album.name = json['title']
            @album.cover = json['album_cover']
            @album.token = json['album_token']
            @album.user_id = @user.id

            #Save Album
            if @album.save
              # Fill In Capture Information to Database
              @capture = Capture.where(:token => json["capture"]["capture_token"]).first
              @capture = Capture.new if !@capture
              @capture.album_id = @album.id
              @capture.title = json["capture"]["title"]
              @capture.token = json["capture"]["capture_token"]
              @capture.latitude = json["capture"]["coords"][0]
              @capture.longitude = json["capture"]["coords"][1]
              @capture.heading = json["capture"]["heading"]
              @capture.description = json["capture"]["description"]
              @capture.taken_at = Time.at(json["capture"]['created_at'].to_i).to_datetime
              @capture.media_type = json["capture"]["media_type"]
              @capture.orientation = json["capture"]["orientation"]
              @capture.encoding_finished = false;
              @capture.mp4_finished = false;
              @capture.webm_finished = false;
              capture_path = @capture.token+"/"+@capture.token
              # Save Capture and Move Files to S3
              if  @capture.save
                AWS::S3::S3Object.store( capture_path+".json", capture_info.read, aws_bucket, :content_type => 'text/json', :access => :public_read )
                AWS::S3::S3Object.store( capture_path+media_file_name, media_file.read, aws_bucket, :content_type => media_file.content_type, :access => :public_read )

                AWS::S3::S3Object.store( capture_path+"-thumb.jpg", thumbnail.read, aws_bucket, :content_type => 'image/jpeg', :access => :public_read )
                AWS::S3::S3Object.store( capture_path+"_geo_data.json", geo_data.read, aws_bucket, :content_type => 'text/json', :access => :public_read )
                if(AWS::S3::S3Object.exists?(@capture.token+"/"+@capture.token+media_file_name, aws_bucket) && capture_type=="video")
                  video = Panda::Video.new(:source_url => "http://s3.amazonaws.com/"+aws_bucket+"/"+@capture.token+"/"+@capture.token+media_file_name,
                                           :path_format => @capture.token+'/'+@capture.token)
                  video.create
                  webm_encoding = video.encodings.create(:profile => "f27ef9a1a48766d12352135131f1d211")
                  mp4_encoding = video.encodings.create(:profile => "901d2cc78542935f4c3c3693e62eac6c")
                  @capture.job_id = video.attributes['id']
                  @capture.webm_id = video.encodings[0].attributes['id']
                  @capture.mp4_id = video.encodings[1].attributes['id']
                  @r.user_id = @capture
                end
              else
                @r = MobileApiError.new 6
              end
            else
              @r = MobileApiError.new 5
            end
          else
            @r = MobileApiError.new 4
          end
        else
          @r = MobileApiError.new 8
        end
      else
        @r = MobileApiError.new 7
      end
    else
      @r = MobileApiError.new 1
    end
    render :json => @r
  end
  ##
  # Recieves an array of capture tokens and then cross references it with capture tokens in the database. It will return all tokens that are
  # no longer in the database and it will remove all tokens that are in the database that are not on the list. (Only for a given user_id)
  # ==== Parameters
  #
  # ==== Returns
  #
  # ==== Example
  # <code>POST /mobile/api/sync/</code>
  def sync
    if params[:token]==md5(params[:email].to_s+"fuckch0p")

    else
      @r = MobileApiError.new 1
    end
    render :json => @r
  end
  ##
  # A simple class that is passed an error method and returns an object that can easily be rendered into JSON.
  class MobileApiError
    def initialize num, errors=nil
      @error_present = true if num != 0
      @error_number = num
      @error_string = "Undefined Error"
      if num == 1
        @error_string = "Invalid/Non-Existant Token"
      elsif num == 2
        @error_string = "Email already in use"
      elsif num == 3
        @error_string = "Incorrect Email/Password Combination"
      elsif num == 4
        @error_string = "Necessary Post Files Are Not Included"
      elsif num == 5
        @error_string = "Could not save Album"
      elsif num == 6
        @error_string = "Could not save Capture"
      elsif num == 7
        @error_string = "Email not specified"
      elsif num == 8
        @error_string = "Could not find given email in database."
      end
      if errors
        @error_string = errors
      end
    end
  end
  ##
  # A simple class that is passed on a succesful something and returns an object that can easily be rendered into JSON.
  class MobileApiResponse
    attr_accessor :user_id, :token
    def initialize
      @error_present = false
      @error_number = 0
    end
  end
end
