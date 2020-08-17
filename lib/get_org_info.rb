module GetOrgInfo

    def make_char_nav_req(request_params)

      # https://api.data.charitynavigator.org/v2/Organizations?app_id=faccfba9&app_key=733418cc676432763bd0daa874b65a9c&search=southern%20poverty%20law%20center&searchType=NAME_ONLY&sort=RELEVANCE

      # NOTE: The free App keys and Id expire before end of August 2020!

      # ALSO, should store keys more securely than this!

      charity_navigator_url = 'https://api.data.charitynavigator.org/v2/Organizations'

      request_params[:app_id] = 'faccfba9'
      request_params[:app_key] = '733418cc676432763bd0daa874b65a9c'
      
      # charity_navigator_params = {
      #   :app_id => 'faccfba9',
      #   :app_key => '733418cc676432763bd0daa874b65a9c',
      #   :search => org.name,
      #   :searchType => 'NAME_ONLY',
      #   :sort => 'RELEVANCE'
      # }

      response = HTTP.get(charity_navigator_url, :params => request_params)

    end

    def get_org_rating(org)

      request_params = {
        :search => org.name,
        :searchType => 'NAME_ONLY',
        :sort => 'RELEVANCE'
      }

      response = make_char_nav_req(request_params)

      if (response.code == 200)
        results = response.parse

        matching_result = results.find do |result|
          result["organization"]["charityName"].downcase == org.name.downcase
        end

        rating = matching_result ? matching_result.dig("currentRating", "rating") : nil
        return rating
      end

    end


    def get_rated_orgs(num = 10)

      request_params = {
        :rated => "TRUE",
        :pageSize => num
      }

      response = make_char_nav_req(request_params)

      if (response.code == 200)
        results = response.parse
        return results
      end

      return

    end

end