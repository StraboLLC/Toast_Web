require 'test_helper'

class MobileApiControllerTest < ActionController::TestCase
  test "should get register" do
    get :register
    assert_response :success
  end

  test "should get login" do
    get :login
    assert_response :success
  end

  test "should get upload" do
    get :upload
    assert_response :success
  end

  test "should get sync" do
    get :sync
    assert_response :success
  end

end
