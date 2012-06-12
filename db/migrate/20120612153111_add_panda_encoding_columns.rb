class AddPandaEncodingColumns < ActiveRecord::Migration
  def change
  	add_column :captures, :mp4_finished, :boolean
  	add_column :captures, :webm_finished, :boolean
  	add_column :captures, :encoding_finished, :boolean
  end
end
