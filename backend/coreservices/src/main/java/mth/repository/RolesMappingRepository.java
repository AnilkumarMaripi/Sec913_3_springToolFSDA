package mth.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;
import mth.models.Rolesmapping;

@Repository
public interface RolesMappingRepository extends JpaRepository<Rolesmapping, Long> {
    
    @Transactional
    @Modifying
    @Query("delete from Rolesmapping RM where RM.role=:role")
    void deleteByRole(@Param("role") Long role);
}
