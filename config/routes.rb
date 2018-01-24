Rails.application.routes.draw do
  get 'pages/home'

  root to: 'pages#home'
  resources :rfi_responses
  resources :projects
  resources :information_requests
  resources :instruments
  resources :equipment
  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
end
