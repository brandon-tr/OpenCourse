using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace OpenCourse.Model;

public class ConnectedClients
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public Guid Id { get; set; }

    public string UserId { get; set; }
    public User User { get; set; }
    public int FailedPong { get; set; }

    public DateTime ConnectedAt { get; set; } = DateTime.UtcNow;
}
