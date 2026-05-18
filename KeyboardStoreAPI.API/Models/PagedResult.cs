using System.Diagnostics.Contracts;

namespace KeyboardStoreAPI.API.Models
{
    public class PagedResult<T>
    {
        public List<T> Data {get; set;} = new List<T>();
        public int Page {get; set;}
        public int PageSize {get; set;}
        public int TotalCount {get; set;}
        public int TotalPages{get; set;}
        public bool HasPrevious => Page > 1;
        public bool HasNext => Page < TotalPages;

    }
}