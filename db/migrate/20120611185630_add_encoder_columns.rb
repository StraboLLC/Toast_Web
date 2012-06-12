class AddEncoderColumns < ActiveRecord::Migration
  def change
  	add_column :captures, :job_id, :string
  	add_column :captures, :mp4_id, :string
  	add_column :captures, :webm_id, :string
  end
end
